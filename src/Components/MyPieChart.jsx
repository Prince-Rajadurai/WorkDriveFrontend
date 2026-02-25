import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MyPieChart({senData , tSize , cSize}) {

    const data = [
        { name: "Size", storage: Number(tSize)/1073741824 },
        { name: "Compress Size", storage: Number(cSize)/1073741824},
        { name: "Files", storage: senData.total_files },
        { name: "File Deduplicate", storage: senData.deduplicate_files},
    ];
    return (
      <div
        style={{
          width: "670px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Storage Usage GB</h3>
  
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="storage" fill="#3b83f6aa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  