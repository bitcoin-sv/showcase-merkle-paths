import {FC} from "react";
import {useCompoundMerkleProof} from "./CompoundMerkleProofProvider.tsx";
import './CompoundMerkleProofView.css'

interface CompoundMerkleProofViewProps {

}

export const CompoundMerkleProofView: FC<CompoundMerkleProofViewProps> = () => {
    const {proof} = useCompoundMerkleProof()

    return <div className={'compound-merkle-path'}>
        <pre>
            {JSON.stringify(proof, null, 2)}
        </pre>
    </div>
}
