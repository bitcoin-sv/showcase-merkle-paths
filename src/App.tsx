import './App.css'
import {MerkleTreeView} from "./MerkleTreeView.tsx";
import {MerkleTreeProvider} from "./MerkleTreeProvider.tsx";
import {MerkleTreeSizeSelector} from "./MerkleTreeSizeSelector.tsx";
import {CompoundMerkleProofProvider} from "./CompoundMerkleProofProvider.tsx";
import {CompoundMerkleProofView} from "./CompoundMerkleProofView.tsx";
import {MerkleProofProvider} from "./MerkleProofsProvider.tsx";
import {MerkleProofsView} from "./MerkleProofsView.tsx";
import {ResetProvider} from "./useReset.tsx";


function App() {
    return (
        <ResetProvider>
            <MerkleTreeProvider>
                <CompoundMerkleProofProvider>
                    <MerkleProofProvider>
                        <MerkleTreeSizeSelector/>
                        <MerkleTreeView/>
                        <MerkleProofsView />
                        <CompoundMerkleProofView/>
                    </MerkleProofProvider>
                </CompoundMerkleProofProvider>
            </MerkleTreeProvider>
        </ResetProvider>
    )
}

export default App

