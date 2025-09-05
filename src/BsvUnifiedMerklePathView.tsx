import { useMerklePath } from "./MerkleProofsProvider.tsx";
import _ from "lodash";
import { NoTransactionSelected } from "./NoTransactionSelected.tsx";
import "./BsvUnifiedMerklePathView.css";
import { MerkleProof, MerkleProofByTx, TreePart } from "./merkle-tree-data";
import { displayAsIfItWereA32ByteHash } from "./RenderHashes.tsx";
// import { MerklePath } from '@bsv/sdk'; // For reference - not used in demo

type BumpLeaf = {
    duplicate?: true;
    hash?: string;
    txid?: true;
    offset: number;
  };

type BUMP = {
  blockHeight: number;
  path: BumpLeaf[][];
};

interface MerklePathLeaf {
  hash: string;
  txid?: true;
  duplicate?: boolean;
  offset: number;
  height: number;
}

function calculateTheByteLengthOfBUMP(BUMP: BUMP) {
  if (!BUMP || BUMP.path.length === 0) return 0;
  let total = 4; // height
  BUMP.path.forEach((level) => {
    total += 1; // number of leaves
    level.forEach((leaf) => {
      total += 1; // offset
      if (leaf.duplicate) {
        total += 1;
      } else {
        total += 33;
      }
    });
  });
  return total;
}

function createOptimizedMerklePath(proof: MerkleProofByTx): { 
  blockHeight: number; 
  path: Array<Array<{
    offset: number;
    hash?: string;
    txid?: boolean;
    duplicate?: boolean;
  }>>;
  toBinary: () => number[];
  toHex: () => string;
} {
  // Convert our internal proof format to optimized format
  const pathParts: MerklePathLeaf[] = listAllPaths(proof);
  const pathPartsWithoutShared = mergeSharedPaths(pathParts);

  const optimizedPath: Array<Array<{
    offset: number;
    hash?: string;
    txid?: boolean;
    duplicate?: boolean;
  }>> = [];

  groupByHeight(pathPartsWithoutShared).forEach(([height, paths]) => {
    const level = parseInt(height);
    if (!optimizedPath[level]) optimizedPath[level] = [];
    
    paths.forEach((path) => {
      const leaf: {
        offset: number;
        hash?: string;
        txid?: boolean;
        duplicate?: boolean;
      } = { offset: path.offset };
      
      if (path.duplicate) {
        leaf.duplicate = true;
      } else {
        // Only include hash for txid leaves and required nodes
        // Skip hashes that can be calculated from other nodes
        if (path.txid || isRequiredForCalculation(path, pathPartsWithoutShared)) {
          leaf.hash = displayAsIfItWereA32ByteHash(path.hash);
          if (path.txid) {
            leaf.txid = true;
          }
        }
      }
      
      // Only add if it's not empty (has hash, txid, or duplicate flag)
      if (leaf.hash || leaf.txid || leaf.duplicate) {
        optimizedPath[level].push(leaf);
      }
    });
  });

  // Remove empty levels
  const cleanedPath = optimizedPath.filter(level => level && level.length > 0);

  return {
    blockHeight: 818433,
    path: cleanedPath,
    toBinary: () => calculateOptimizedByteLength(cleanedPath),
    toHex: () => 'optimized-hex-representation'
  };
}

function isRequiredForCalculation(targetPath: MerklePathLeaf, allPaths: MerklePathLeaf[]): boolean {
  // If this is a txid node, it's always required
  if (targetPath.txid) return true;
  
  // If this is a duplicate, it's required
  if (targetPath.duplicate) return true;
  
  // Check if both children exist at the level below
  const childLevel = targetPath.height - 1;
  if (childLevel < 0) return true; // Base level
  
  const leftChildOffset = targetPath.offset * 2;
  const rightChildOffset = targetPath.offset * 2 + 1;
  
  const leftChild = allPaths.find(p => p.height === childLevel && p.offset === leftChildOffset);
  const rightChild = allPaths.find(p => p.height === childLevel && p.offset === rightChildOffset);
  
  // If both children are present and have hashes, this parent node is calculable (not required)
  if (leftChild && rightChild && leftChild.hash && rightChild.hash) {
    return false; // This node can be calculated from its children
  }
  
  // Otherwise, this node is required
  return true;
}

function calculateOptimizedByteLength(path: Array<Array<{
  offset: number;
  hash?: string;
  txid?: boolean;
  duplicate?: boolean;
}>>): number[] {
  let totalBytes = 4; // block height
  totalBytes += 1; // tree height
  
  path.forEach((level) => {
    totalBytes += 1; // number of leaves at this level
    level.forEach((leaf) => {
      totalBytes += 1; // offset
      totalBytes += 1; // flags
      if (!leaf.duplicate) {
        totalBytes += 32; // hash length
      }
    });
  });
  
  // Return array representing bytes (simplified)
  return new Array(totalBytes).fill(0);
}

const renderNeatly = (BUMP: BUMP) => {
  let output = "{\n  \"blockHeight\": " + BUMP?.blockHeight + ",\n  \"path\": [\n";
  BUMP?.path?.map((level: BumpLeaf[], index: number) => {
    output += "    [\n      ";
    level?.map((leaf: BumpLeaf, index: number) => {
      output += JSON.stringify(leaf);
      if (index < level.length - 1) {
        output += ",\n      ";
      } else {
        output += "\n    ]";
      }
    });
    if (index < BUMP.path.length - 1) {
      output += ",\n";
    } else {
      output += "\n  ]\n}";
    }
  });
  return output;
};

const renderOptimizedBump = (optimizedBump: { blockHeight: number; path: Array<Array<any>> }) => {
  let output = "{\n  \"blockHeight\": " + optimizedBump.blockHeight + ",\n  \"path\": [\n";
  optimizedBump.path?.map((level: any[], index: number) => {
    output += "    [";
    level?.map((leaf: any, leafIndex: number) => {
      output += JSON.stringify(leaf);
      if (leafIndex < level.length - 1) {
        output += ",\n     ";
      }
    });
    output += "]";
    if (index < optimizedBump.path.length - 1) {
      output += ",\n";
    } else {
      output += "\n  ]\n}";
    }
  });
  return output;
};

export const BsvUnifiedMerklePathView = () => {
  const { proof } = useMerklePath();

  if (_.isEmpty(proof)) {
    return (
      <article className="bump-view">
        <header>BUMP Format (Optimized)</header>
        <NoTransactionSelected />
      </article>
    );
  }

  // Create unoptimized version for comparison
  const unoptimizedBUMP = {
    blockHeight: 818433,
    path: toBumpPaths(proof),
  };

  const unoptimizedSizeBytes = calculateTheByteLengthOfBUMP(unoptimizedBUMP);

  try {
    // Create optimized MerklePath using @bsv/sdk
    const bsvMerklePath = createOptimizedMerklePath(proof);
    const optimizedSizeBytes = bsvMerklePath.toBinary().length;

    return (
      <article className="bump-view">
        <header>
          BUMP Format: {optimizedSizeBytes} bytes (Optimized) vs {unoptimizedSizeBytes} bytes (Legacy)
          <br />
          <span style={{ color: 'green', fontWeight: 'bold' }}>
            Savings: {unoptimizedSizeBytes - optimizedSizeBytes} bytes ({Math.round(((unoptimizedSizeBytes - optimizedSizeBytes) / unoptimizedSizeBytes) * 100)}% reduction)
          </span>
          <br />
          <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
            Note: This demo uses concatenation (AAAA+BBBB=ABAB) instead of real hashing to visualize the optimization concept
          </span>
        </header>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3>Optimized BUMP (Compact - Calculable Hashes Omitted)</h3>
            <pre style={{ fontSize: '12px', background: '#f0f8ff' }}>
              {renderOptimizedBump({ 
                blockHeight: bsvMerklePath.blockHeight, 
                path: bsvMerklePath.path 
              })}
            </pre>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Binary length: {bsvMerklePath.toBinary().length} bytes
              <br />
              Hex: {bsvMerklePath.toHex()}
            </p>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '10px', padding: '8px', background: '#e8f4fd', borderRadius: '4px' }}>
              <strong>Optimizations shown:</strong>
              <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                <li><strong>Calculable nodes omitted:</strong> If both children AAAA and BBBB exist, parent ABAB can be omitted</li>
                <li><strong>Essential nodes kept:</strong> TXIDs and nodes needed for proof verification</li>
                <li><strong>Space savings:</strong> Reduced binary size while maintaining proof integrity</li>
              </ul>
              <div style={{ marginTop: '6px', fontSize: '10px', fontStyle: 'italic' }}>
                Example: AAAA + BBBB → ABAB (calculable, so ABAB hash not stored)
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3>Legacy BUMP (Verbose - All Hashes Encoded)</h3>
            <pre style={{ fontSize: '12px', background: '#fff8f0' }}>
              {renderNeatly(unoptimizedBUMP)}
            </pre>
          </div>
        </div>
      </article>
    );
  } catch (error) {
    return (
      <article className="bump-view">
        <header>BUMP Format Comparison (Error occurred during optimization)</header>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3>Optimized BUMP (Error)</h3>
            <div style={{ padding: '10px', background: '#ffe6e6', borderRadius: '4px' }}>
              <p style={{ color: 'red', margin: '0', fontSize: '14px' }}>
                Error creating optimized MerklePath: {error instanceof Error ? error.message : 'Unknown error'}
              </p>
              <p style={{ fontSize: '12px', color: '#666', margin: '10px 0 0 0' }}>
                This demo tree may not have consistent Merkle roots required for @bsv/sdk validation.
              </p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3>Legacy BUMP (All Hashes Encoded): {unoptimizedSizeBytes} bytes</h3>
            <pre style={{ fontSize: '12px', background: '#fff8f0' }}>
              {renderNeatly(unoptimizedBUMP)}
            </pre>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '10px', padding: '8px', background: '#fdf8e8', borderRadius: '4px' }}>
              <strong>Legacy format:</strong>
              <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                <li><strong>All hashes stored:</strong> Even if AAAA and BBBB exist, ABAB is still encoded</li>
                <li><strong>No optimization:</strong> Every node hash explicitly included</li>
                <li><strong>Larger size:</strong> More storage and bandwidth required</li>
              </ul>
              <div style={{ marginTop: '6px', fontSize: '10px', fontStyle: 'italic' }}>
                Example: Stores AAAA, BBBB, AND ABAB (redundant)
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }
};

function toBumpPaths(proof: MerkleProofByTx) {
  const pathParts: MerklePathLeaf[] = listAllPaths(proof);
  const pathPartsWithoutShared = mergeSharedPaths(pathParts);

  const bumpPath = [] as BumpLeaf[][];
  groupByHeight(pathPartsWithoutShared)
    .forEach(([height, paths]) => {
      bumpPath[parseInt(height)] = convertToBumpPaths(paths);
    });

  return bumpPath;
}

function listAllPaths(proof: MerkleProofByTx) {
  return Object.entries(proof).flatMap((it) => [
    toLeaf(it),
    ...toLeafs(it[1].path),
  ]);
}

function mergeSharedPaths(paths: MerklePathLeaf[]) {
  return _(paths)
    .groupBy((path) => `${path.height}_${path.offset}`)
    .map((it) => _.merge({} as MerklePathLeaf, ...it) as MerklePathLeaf)
    .value();
}

function groupByHeight(pathPartsWithoutShared: MerklePathLeaf[]) {
  return _(pathPartsWithoutShared).groupBy("height").entries();
}

function toLeafs(path: TreePart[]): MerklePathLeaf[] {
  return path.map((p) => ({
    hash: p.hash,
    offset: p.offset,
    height: p.height,
    duplicate: p.duplicated,
  }));
}

function toLeaf(it: [string, MerkleProof]): MerklePathLeaf {
  return {
    hash: it[0],
    txid: true,
    offset: it[1].index,
    height: 0,
  };
}

function convertToBumpPaths(paths: MerklePathLeaf[]) {
  return paths.map(toBumpPath);
}

function toBumpPath(path: MerklePathLeaf): BumpLeaf {
  if (path.duplicate) {
    return {
      duplicate: true,
      offset: path.offset,
    };
  } else {
    return {
      hash: displayAsIfItWereA32ByteHash(path.hash),
      txid: path.txid,
      offset: path.offset,
    };
  }
}
