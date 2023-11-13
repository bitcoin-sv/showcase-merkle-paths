import "./TscMerkleProofsView.css";
import { FC } from "react";
import { useMerklePath } from "../../providers/MerkleProofsProvider/MerkleProofsProvider.tsx";
import { MerkleProofByTx } from "../../types/merkle-tree-data";
import * as _ from "lodash";
import { NoTransactionSelected } from "../NoTransactionSelected/NoTransactionSelected.tsx";

const TscMerkleProofList: FC<{ proof: MerkleProofByTx }> = ({ proof }) => {
  return (
    <div className="tsc-merkle-proofs">
      {Object.entries(proof)
        .map((it) => ({
          index: it[1].index,
          txOrId: it[0],
          targetType: "header",
          target: "00aHEADER_HASH_IS_HERE",
          nodes: it[1].path,
        }))
        .map((it) => ({ ...it, nodes: it.nodes.map((n) => n.hash) }))
        .map((it) => (
          <TscMerkleProof key={it.txOrId} proof={it} />
        ))}
    </div>
  );
};

export interface TscMerkleProofFormat {
  index: number;
  txOrId: string;
  targetType: string;
  target: string;
  nodes: string[];
}

const TscMerkleProof: FC<{ proof: TscMerkleProofFormat }> = ({ proof }) => {
  return <pre>{JSON.stringify(proof, null, 2)}</pre>;
};

export const TscMerkleProofsView = () => {
  const { proof } = useMerklePath();

  return (
    <div className="tsc-merkle-proofs-view">
      <header>TSC format of Merkle Proofs [DEPRECATED]:</header>
      {_.isEmpty(proof) ? (
        <NoTransactionSelected />
      ) : (
        <TscMerkleProofList proof={proof} />
      )}
    </div>
  );
};