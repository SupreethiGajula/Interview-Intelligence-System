import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function ScoreChart({ candidate }) {
  const data = [
    { name: "DSA", value: candidate.dsaScore || 0 },
    { name: "System Design", value: candidate.systemDesignScore || 0 },
    { name: "Projects", value: candidate.projectScore || 0 },
    { name: "HR", value: candidate.hrScore || 0 }
  ];

  // Define colors for each score
  const COLORS = ["#6366F1", "#F472B6", "#34D399", "#FBBF24"]; // Indigo, Pink, Green, Yellow

  return (
    <PieChart width={300} height={250}>
      <Pie
        data={data}
        dataKey="value"
        outerRadius={100}
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip 
  formatter={(value, name) => [`${value} pts`, name]} 
  contentStyle={{ backgroundColor: "#f3f4f7", color: "#fff", borderRadius: "8px" }}
/>
      <Legend />
    </PieChart>
  );
}

export default ScoreChart;