export default function LabLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="ko" data-theme="light">
        <body>{children}</body>
      </html>
    );
  }