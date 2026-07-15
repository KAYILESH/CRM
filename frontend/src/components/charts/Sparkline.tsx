import { LineChart, Line, ResponsiveContainer } from 'recharts';
interface SparklineProps { data: number[]; color: string; height?: number; }
export function Sparkline({ data, color, height = 44 }: SparklineProps) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={d} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} animationDuration={1200} />
      </LineChart>
    </ResponsiveContainer>
  );
}
