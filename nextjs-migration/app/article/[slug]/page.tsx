export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>Article: {slug}</h1>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>Article content will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
