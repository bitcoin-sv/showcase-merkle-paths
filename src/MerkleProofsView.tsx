import './MerkleProofsView.css'
import {FC} from "react";
import {useMerkleProofs} from "./MerkleProofsProvider.tsx";
import {MerkleProofByTx} from "./merkle-tree-data";
import * as _ from "lodash";
import {NoTransactionSelected} from "./NoTransactionSelected.tsx";

interface MerkleProofsViewProps {

}

const MerkleProofList: FC<{ proof: MerkleProofByTx }> = ({proof}) => {
    return <div className='merkle-proofs'>
        {
            Object.values(proof).map(it => <pre key={it.txOrId}>{JSON.stringify(it, null, 2)}</pre>)
        }
    </div>;
}

export const MerkleProofsView: FC<MerkleProofsViewProps> = () => {
    const {proof} = useMerkleProofs();

    return <div className='merkle-proofs-view'>
        <header>Merkle Proofs:</header>
        {_.isEmpty(proof)
            ? <NoTransactionSelected/>
            : <MerkleProofList proof={proof}/>
        }
    </div>
}
