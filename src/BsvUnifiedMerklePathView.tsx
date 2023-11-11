import { useMerklePath } from "./MerkleProofsProvider.tsx";
import _ from "lodash";
import { NoTransactionSelected } from "./NoTransactionSelected.tsx";
import "./BsvUnifiedMerklePathView.css";
import { MerkleProofByTx } from "./merkle-tree-data";

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
  let bump: BumpLeaf[][] = [];

  for (const [key, val] of Object.entries(proof)) {
    const height = val.path.length;
    const bumpPath: BumpLeaf[][] = Array.from(Array(height), () => []);

    bumpPath[0].push({
      offset: val.index,
      txid: true,
      hash: key,
    });

    for (let i = 0; i < val.path.length; i++) {
      if (val.path[i].duplicated) {
        bumpPath[i].push({
          offset: val.path[i].offset,
          duplicate: true,
        });
      } else {
        bumpPath[i].push({
          offset: val.path[i].offset,
          hash: val.path[i].hash,
        });
      }
    }

    bump = mergeBumps(bump, bumpPath);
  }

  return bump;
}

const mergeBumps = (bump: BumpLeaf[][], bumpPath: BumpLeaf[][]) => {
  if (bump.length === 0) {
    bump = Array.from(Array(bumpPath.length), () => []);
  }

  for (let i = 0; i < bump.length; i++) {
    for (const elem of bumpPath[i]) {
      const existingElem = bump[i].find((b) => b.offset === elem.offset);

      if (!existingElem) {
        bump[i].push(elem);
      } else if (i === 0 && elem.txid && elem.txid === true) {
        existingElem.txid = true;
      }
    }

    bump[i].sort((a, b) => a.hash.localeCompare(b.hash));
  }

  return bump;
};
