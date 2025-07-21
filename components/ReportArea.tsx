export default function ReportArea({text}:{text:string}) {
  if(!text) return null;
  return (
    <section className="mt-8 bg-gray-50 p-6 rounded">
      <h2 className="font-semibold mb-2">Your Report 😜</h2>
      <p className="whitespace-pre-wrap">{text}</p>
    </section>
  );
}
