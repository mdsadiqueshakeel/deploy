import { Tree, TreeNode } from "react-organizational-chart";
import { useEffect, useState } from "react";
import api from "../utils/api"; // Adjust the import path as needed

const BinaryTreeNode = ({ node }) => {
  return (
    <TreeNode
      label={
        <div className="p-2 bg-white border rounded shadow text-center w-32">
          <p className="font-semibold text-sm">{node.name}</p>
          <p className="text-xs text-gray-500">{node.email}</p>
        </div>
      }
    >
      {node.children?.map((child, i) => (
        <BinaryTreeNode key={i} node={child} />
      ))}
    </TreeNode>
  );
};

export default function BinaryTree({ userId }) {
  const [treeData, setTreeData] = useState(null);
  const [mounted, setMounted] = useState(false);

  // 🚨 Prevent SSR errors with useEffect
  useEffect(() => {
    setMounted(true);
  }, []);

   useEffect(() => {
    if (!userId) return;
    api
      .get(`/api/referral/binary-tree/${userId}`)
      .then((res) => {
        console.log("Tree Data:", res.data);
        setTreeData(res.data);
      })
      .catch((err) => {
        console.error("Tree fetch failed", err);
      });
      console.log("Using API base:", process.env.NEXT_PUBLIC_API_URL);

  }, [userId]);

  if (!mounted) return null;

  if (!treeData) return <p>Loading tree...</p>;

  return (
    <div className="overflow-auto">
      <Tree
        label={<BinaryTreeNode node={treeData} />}
        lineWidth={"2px"}
        lineColor={"#999"}
        lineBorderRadius={"10px"}
      >
        {treeData.children?.map((child, i) => (
          <BinaryTreeNode key={i} node={child} />
        ))}
      </Tree>
    </div>
  );
}
