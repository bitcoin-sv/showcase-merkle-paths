import "./MerkleTreeView.css";
import { FC, PropsWithChildren, useState } from "react";
import { TreeLeaf, TreeNode, TreePart, MerkleTree, DuplicatedNode } from "./merkle-tree-data";
import { useMerkleTree } from "./MerkleTreeProvider.tsx";
import * as _ from "lodash";
import { useMerklePath } from "./MerkleProofsProvider.tsx";

export const MerkleTreeView = () => {
  const { tree } = useMerkleTree();

  return (
    <figure>
      <ul className="tree">
        <MerkleRoot key={tree.hash} tree={tree} />
      </ul>
    </figure>
  );
};

interface MerkleRootProps {
  tree: MerkleTree;
}
const MerkleRoot: FC<MerkleRootProps> = ({ tree }) => {
  return (
    <li
      title={`Hash: ${tree.hash}
 tree height: ${tree.height - 1}`}
    >
      <code>Merkle Root</code>
      <Branches left={tree.left} right={tree.right} />
    </li>
  );
};

interface BaseNodeProps {
  isPartOfMerkleProof?: boolean;
  onSelectionChange?: (selected: boolean, hash: string) => void;
}

interface MerkleNodeProps extends BaseNodeProps {
  part: TreeNode ;
}

const MerkleNode: FC<MerkleNodeProps> = ({
  part,
  isPartOfMerkleProof = false,
  onSelectionChange = () => {},
}) => {
  return (
    <MerkleTreePart
      part={part}
      className={`${isPartOfMerkleProof ? "merkleproof" : ""}`}
    >
      <Branches
        left={part.left}
        right={part.right}
        onSelectionChange={onSelectionChange}
      />
    </MerkleTreePart>
  );
};

function isLeaf(part: TreePart): part is TreeLeaf | DuplicatedNode {
  return !("left" in part && "right" in part);
}

interface BranchesProps {
  left: TreePart;
  right: TreePart;
  onSelectionChange?: (selected: boolean, hash: string) => void;
}

interface MerkleTreePartState {
  left: string[];
  right: string[];
}

const Branches: FC<BranchesProps> = ({
  left,
  right,
  onSelectionChange = () => {},
}) => {
  const [merkleTreePart, setMerkleTreePart] = useState<MerkleTreePartState>({
    left: [],
    right: [],
  });
  const { add: addToMerkleProofs } = useMerklePath();
  const leftSelectionHandler = (selected: boolean, hash: string) => {
    const val = {
      left: [...merkleTreePart.left],
      right: [...merkleTreePart.right],
    };
    if (selected) {
      val.right.push(hash);
      addToMerkleProofs(hash, right);
    } else {
      val.right = val.right.filter((it) => it !== hash);
    }
    setMerkleTreePart(val);
    onSelectionChange(selected, hash);
  };

  const rightSelectionHandler = (selected: boolean, hash: string) => {
    const val = {
      left: [...merkleTreePart.left],
      right: [...merkleTreePart.right],
    };
    if (selected) {
      val.left.push(hash);
      addToMerkleProofs(hash, left);
    } else {
      val.left = val.left.filter((it) => it !== hash);
    }
    setMerkleTreePart(val);
    onSelectionChange(selected, hash);
  };

  return (
    <ul>
      {isLeaf(left) ? (
        <MerkleTreeLeaf
          part={left}
          isPartOfMerkleProof={!_.isEmpty(merkleTreePart.left)}
          onSelectionChange={leftSelectionHandler}
        />
      ) : (
        <MerkleNode
          part={left}
          isPartOfMerkleProof={!_.isEmpty(merkleTreePart.left)}
          onSelectionChange={leftSelectionHandler}
        />
      )}
      {isLeaf(right) ? (
        <MerkleTreeLeaf
          part={right}
          isPartOfMerkleProof={!_.isEmpty(merkleTreePart.right)}
          onSelectionChange={rightSelectionHandler}
        />
      ) : (
        <MerkleNode
          part={right}
          isPartOfMerkleProof={!_.isEmpty(merkleTreePart.right)}
          onSelectionChange={rightSelectionHandler}
        />
      )}
    </ul>
  );
};

interface MerkleTreeLeafProps extends BaseNodeProps {
  part: TreeLeaf | DuplicatedNode;
}

const MerkleTreeLeaf: FC<MerkleTreeLeafProps> = ({
  part,
  isPartOfMerkleProof = false,
  onSelectionChange = () => {},
}) => {
  const [selected, setSelected] = useState(false);
  const merkleProof = useMerklePath();

  const clickHandler = () => {
    if (part.duplicated) {
      return;
    }

    const val = !selected;
    setSelected(val);
    if (val) {
      merkleProof.add(part.hash, part);
    } else {
      merkleProof.remove(part.hash);
    }
    onSelectionChange(val, part.hash);
  };

  return (
    <MerkleTreePart
      part={part}
      onClick={clickHandler}
      className={`${!part.duplicated && "clickable"} ${
        selected && "selected"
      } ${isPartOfMerkleProof && "merkleproof"}`}
    />
  );
};

interface MerkleTreePartProps {
  part: TreePart;
  onClick?: () => void;
  className?: string;
}

const MerkleTreePart: FC<PropsWithChildren<MerkleTreePartProps>> = ({
  part,
  onClick = () => {},
  className = "",
  children,
}) => {
  return (
    <li
      title={`height: ${part.height} offset: ${part.offset}`}
      onClick={onClick}
      className={className}
    >
      <code>
        {part.offset}: {part.duplicated ? "*" : part.hash}
      </code>
      {children}
    </li>
  );
};
