import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function ScoreChart({ candidate }) {

  const data = [
    { name: "DSA", value: candidate.dsaScore || 0 },
    { name: "System Design", value: candidate.systemDesignScore || 0 },
    { name: "Projects", value: candidate.projectScore || 0 },
    { name: "HR", value: candidate.hrScore || 0 }
  ];

  return (
    <PieChart width={300} height={250}>
      <Pie
        data={data}
        dataKey="value"
        outerRadius={100}
        label
      >
        {data.map((entry, index) => (
          <Cell key={index} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

export default ScoreChart;