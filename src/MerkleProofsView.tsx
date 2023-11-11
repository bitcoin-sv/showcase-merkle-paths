import "./MerkleProofsView.css";
import { FC } from "react";
import { useMerklePath } from "./MerkleProofsProvider.tsx";
import { MerkleProofByTx } from "./merkle-tree-data";
import * as _ from "lodash";
import { NoTransactionSelected } from "./NoTransactionSelected.tsx";

interface MerklePath {
  index: number;
  path: string[];
  txid: string;
}

const prepareMerklePaths = (proof: MerkleProofByTx) => {
  const merklePaths: MerklePath[] = [];

  for (const [key, val] of Object.entries(proof)) {
    const mp: MerklePath = {
      txid: key,
      index: val.index,
      path: val.path.map((p) => p.hash),
    };
    merklePaths.push(mp);
  }

  return merklePaths;
};

const MerkleProofList: FC<{ proof: MerkleProofByTx }> = ({ proof }) => {
  const merklePaths = prepareMerklePaths(proof);
  return (
    <div className="merkle-proofs">
      {merklePaths.map((mp) => (
        <pre key={mp.txid}>{JSON.stringify(mp, null, 2)}</pre>
      ))}
    </div>
  );
};

export const MerkleProofsView = () => {
  const { proof } = useMerklePath();

  return (
    <div className="merkle-proofs-view">
      <header>Merkle Path(s):</header>
      {_.isEmpty(proof) ? (
        <NoTransactionSelected />
      ) : (
        <MerkleProofList proof={proof} />
      )}
    </div>
  );
};
