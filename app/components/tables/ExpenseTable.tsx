const expenses = [
{ date: "09/11/2022", title: "Food Catering", merchant: "McFood", amount: "₹250.00", report: "November_2022", status: "Not Submitted" },
{ date: "10/11/2022", title: "Office Supplies", merchant: "Officio", amount: "₹150.00", report: "November_2022", status: "Not Submitted" },
{ date: "11/11/2022", title: "Business Lunch", merchant: "Restaurant", amount: "₹75.50", report: "November_2022", status: "Submitted" },
{ date: "12/11/2022", title: "Client Dinner", merchant: "Bistro", amount: "₹120.00", report: "November_2022", status: "Submitted" },
];


export default function ExpenseTable() {
return (
<table className="w-full text-left text-sm text-gray-300">
<thead className="text-gray-400 border-b border-gray-700">
<tr>
<th className="p-3">Details</th>
<th className="p-3">Merchant</th>
<th className="p-3">Amount</th>
<th className="p-3">Report</th>
<th className="p-3">Status</th>
</tr>
</thead>
<tbody>
{expenses.map((e, i) => (
<tr key={i} className="border-b border-gray-800 hover:bg-[#222]">
<td className="p-3">
<p className="text-white">{e.title}</p>
<p className="text-gray-500 text-xs">{e.date}</p>
</td>
<td className="p-3">{e.merchant}</td>
<td className="p-3 font-semibold">{e.amount}</td>
<td className="p-3">{e.report}</td>
<td className="p-3">
<span
className={`px-3 py-1 rounded-full text-xs ${
e.status === "Submitted"
? "bg-purple-600"
: "bg-pink-600"
}`}
>
{e.status}
</span>
</td>
</tr>
))}
</tbody>
</table>
);
}