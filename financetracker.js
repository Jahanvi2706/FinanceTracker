import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectItem } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const categories = ["Food", "Transport", "Entertainment", "Bills", "Others"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff7300"];

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [budgets, setBudgets] = useState({ Food: 500, Transport: 300, Entertainment: 200, Bills: 400, Others: 100 });

  const addTransaction = () => {
    if (!amount || !date || !description || !category) return;
    setTransactions([...transactions, { amount: parseFloat(amount), date, description, category }]);
    setAmount("");
    setDate("");
    setDescription("");
  };

  const deleteTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const categoryData = categories.map(cat => ({
    name: cat,
    value: transactions.filter(tx => tx.category === cat).reduce((sum, tx) => sum + tx.amount, 0)
  }));

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Personal Finance Visualizer</h1>
      <div className="flex gap-2 mb-4">
        <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>{category}</SelectTrigger>
          <SelectContent>
            {categories.map((cat, index) => (
              <SelectItem key={index} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addTransaction}>Add</Button>
      </div>
      <Card>
        <CardContent>
          {transactions.map((tx, index) => (
            <div key={index} className="flex justify-between p-2 border-b">
              <span>{tx.date}</span>
              <span>{tx.description}</span>
              <span>{tx.category}</span>
              <span>Rs {tx.amount}</span>
              <Button variant="destructive" size="sm" onClick={() => deleteTransaction(index)}>X</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="h-64">
          <h2 className="text-lg font-bold mb-2">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transactions.map(tx => ({ name: tx.date, amount: tx.amount }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <h2 className="text-lg font-bold mb-2">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">Budget vs Actual</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categories.map(cat => ({
            name: cat,
            Budget: budgets[cat],
            Spent: categoryData.find(c => c.name === cat)?.value || 0
          }))}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Budget" fill="#8884d8" />
            <Bar dataKey="Spent" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
