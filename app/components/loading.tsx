// app/components/loading.tsx
export default function Loading({ progress }: { progress?: number }) {
  return (
    <div className='loading'>
      <div className='loading-bar'>
        <div
          className={`loading-fill ${progress === undefined ? 'loading-fill--indeterminate' : ''}`}
          style={progress !== undefined ? { width: `${progress}%` } : undefined}
        />
      </div>
      <p className='loading-text'>loading</p>
    </div>
  );
}
