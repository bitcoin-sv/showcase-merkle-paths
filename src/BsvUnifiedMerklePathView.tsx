import { useMerklePath } from "./MerkleProofsProvider.tsx";
import _ from "lodash";
import { NoTransactionSelected } from "./NoTransactionSelected.tsx";
import "./BsvUnifiedMerklePathView.css";
import { MerkleProof, MerkleProofByTx, TreePart } from "./merkle-tree-data";
import { displayAsIfItWereA32ByteHash } from "./RenderHashes.tsx";

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

export const BsvUnifiedMerklePathView = () => {
  const { proof } = useMerklePath();

  const BUMP = {
    blockHeight: 818433,
    path: toBumpPaths(proof),
  };

  const renderNeatly = (BUMP : BUMP) => {
    let output = "{\n  \"blockHeight\": " + BUMP?.blockHeight + ",\n  \"path\": [\n";
    BUMP?.path?.map((level : BumpLeaf[], index : number) => {
      output += "    [\n      ";
      level?.map((leaf : BumpLeaf, index : number) => {
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
    return output
  }

  return (
    <article className="bump-view">
      <header>BUMP Format: {calculateTheByteLengthOfBUMP(BUMP)} bytes</header>
      {_.isEmpty(proof) ? (
        <NoTransactionSelected />
      ) : (
        <pre>
          {renderNeatly(BUMP)}
        </pre>
      )}
    </article>
  );
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
