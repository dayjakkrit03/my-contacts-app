export default function ShoppingPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ช้อปปิ้ง</h1>
      <iframe
        src="https://interlink-shop.lovable.app/"
        title="Shopping"
        className="w-full h-[calc(100vh-150px)] border-0 rounded-lg"
      />
    </div>
  );
}