import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="mb-2 text-3xl font-bold">Khong tim thay du an</h1>
      <p className="mb-6 text-muted-foreground">
        Du an co the da bi di chuyen, xoa hoac slug chua duoc dong bo.
      </p>
      <Link href="/du-an" className="text-[#1a63a8] underline">
        Quay lai danh sach du an
      </Link>
    </div>
  );
}
