export default function LabLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="ko">
        <body>{children}</body>
      </html>
    );
  }