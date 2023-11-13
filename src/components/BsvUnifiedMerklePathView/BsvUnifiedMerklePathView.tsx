import { useMerklePath } from "../../providers/MerkleProofsProvider/MerkleProofsProvider.tsx";
import _ from "lodash";
import { NoTransactionSelected } from "../NoTransactionSelected/NoTransactionSelected.tsx";
import "./BsvUnifiedMerklePathView.css";
import {
  MerkleProof,
  MerkleProofByTx,
  TreePart,
} from "../../types/merkle-tree-data";

type BumpLeaf =
  | {
      hash: string;
      txid?: true;
      offset: number;
    }
  | {
      offset: number;
      duplicate: true;
    };

interface MerklePathLeaf {
  hash: string;
  txid?: true;
  duplicate?: boolean;
  offset: number;
  height: number;
}

export const BsvUnifiedMerklePathView = () => {
  const { proof } = useMerklePath();

  const BUMP = {
    blockHeight: 987_654_321,
    path: toBumpPaths(proof),
  };

  return (
    <article className="bump-view">
      <header>BUMP:</header>
      {_.isEmpty(proof) ? (
        <NoTransactionSelected />
      ) : (
        <pre>
          {JSON.stringify(
            BUMP,
            ["blockHeight", "path", "offset", "hash", "txid", "duplicate"],
            2,
          )}
        </pre>
      )}
    </article>
  );
};

function toBumpPaths(proof: MerkleProofByTx) {
  const pathParts: MerklePathLeaf[] = listAllPaths(proof);
  const pathPartsWithoutShared = mergeSharedPaths(pathParts);

  const bumpPath = [] as BumpLeaf[][];
  groupByHeight(pathPartsWithoutShared).forEach(([height, paths]) => {
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
      hash: path.hash,
      txid: path.txid,
      offset: path.offset,
    };
  }
}
