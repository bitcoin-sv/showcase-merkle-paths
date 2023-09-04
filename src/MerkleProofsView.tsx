import './MerkleProofsView.css'
import {FC} from "react";
import {useMerkleProofs} from "./MerkleProofsProvider.tsx";

interface MerkleProofsViewProps {

}

export const MerkleProofsView: FC<MerkleProofsViewProps> = () => {
    const {proof} = useMerkleProofs();

    return <div className='merkle-proofs-view'>
        <header>Merkle Proofs</header>
        <div className='merkle-proofs'>
            {
                Object.values(proof).map(it => <pre key={it.txOrId}>{JSON.stringify(it, null, 2)}</pre>)
            }
        </div>
    </div>
}
