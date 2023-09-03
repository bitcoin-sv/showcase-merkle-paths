import './App.css'
import {MerkleTreeView} from "./MerkleTreeView.tsx";
import {MerkleTreeProvider} from "./MerkleTreeProvider.tsx";
import {MerkleTreeSizeSelector} from "./MerkleTreeSizeSelector.tsx";
import {CompoundMerkleProofProvider} from "./CompoundMerkleProofProvider.tsx";
import {CompoundMerkleProofView} from "./CompoundMerkleProofView.tsx";



function App() {
    return (
            <MerkleTreeProvider>
                <CompoundMerkleProofProvider>
                    <MerkleTreeSizeSelector />
                    <MerkleTreeView />
                    <CompoundMerkleProofView />
                </CompoundMerkleProofProvider>
            </MerkleTreeProvider>
    )
}

export default App

