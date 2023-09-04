import {Component, FC} from "react";
import {useCompoundMerkleProof} from "./CompoundMerkleProofProvider.tsx";
import './CompoundMerkleProofView.css'
import {NoTransactionSelected} from "./NoTransactionSelected.tsx";
import * as _ from "lodash";

interface CompoundMerkleProofViewProps {

}

class CompoundMerklePath extends Component<{ value: Record<string, number>[] }> {
    render() {
        return <div className="compound-merkle-path">
            <pre>
                {JSON.stringify(this.props.value, null, 2)}
            </pre>
        </div>;
    }
}

export const CompoundMerkleProofView: FC<CompoundMerkleProofViewProps> = () => {
    const {proof} = useCompoundMerkleProof()

    return <div className={'compound-merkle-path-view'}>
        <header>Compound Merkle Proof (CMP)</header>
        {
            _.isEmpty(proof)
            ? <NoTransactionSelected />
            : <CompoundMerklePath value={proof}/>
        }
    </div>
}
