import { ChangeEvent, FC, useState } from "react";
import { useMerkleTree } from "./MerkleTreeProvider.tsx";

export const MerkleTreeSizeSelector: FC = () => {
  const { setTreeOfSize } = useMerkleTree();
  const [size, setSize] = useState<number>(2);

  const changeSize = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selectedSize = parseInt(value);
    setSize(selectedSize);
    setTreeOfSize(selectedSize);
  };

  return (
    <div>
      <span>Number of transactions: </span>
      <select value={size} onChange={changeSize}>
        <option value={2}>{2}</option>
        <option value={4}>{4}</option>
        <option value={8}>{8}</option>
        <option value={16}>{16}</option>
        <option value={32}>{32}</option>
      </select>
    </div>
  );
};
