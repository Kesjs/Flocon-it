export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-['Inter'] antialiased bg-[#F9FAFB]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
