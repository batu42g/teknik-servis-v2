export default function AboutPage() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-5">
          <h1 className="text-center mb-4">Hakkımızda</h1>
          <div className="w-50 mx-auto">
            <hr className="border-primary" />
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-md-6">
          <h2 className="mb-4">Biz Kimiz?</h2>
          <p className="lead">
            Efe Bilgisayar ve Güvenlik Sistemleri olarak, 2010 yılından bu yana teknoloji dünyasında güvenilir çözümler sunuyoruz.
          </p>
          <p>
            Bilgisayar tamiri, güvenlik sistemleri kurulumu ve teknolojik danışmanlık alanlarında uzman ekibimizle, müşterilerimize en kaliteli hizmeti sunmayı hedefliyoruz.
          </p>
        </div>
        <div className="col-md-6">
          <div className="bg-light p-4 rounded-3 h-100">
            <h3 className="mb-3">Hizmetlerimiz</h3>
            <ul className="list-unstyled">
              <li className="mb-3">
                <i className="bi bi-laptop me-2"></i>
                Bilgisayar ve Notebook Tamiri
              </li>
              <li className="mb-3">
                <i className="bi bi-camera-video me-2"></i>
                Güvenlik Kamera Sistemleri
              </li>
              <li className="mb-3">
                <i className="bi bi-shield-check me-2"></i>
                Alarm Sistemleri
              </li>
              <li className="mb-3">
                <i className="bi bi-pc-display me-2"></i>
                Donanım ve Yazılım Çözümleri
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-12">
          <div className="bg-primary bg-opacity-10 p-4 rounded-3">
            <h2 className="mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-clock-history fs-4 me-3 text-primary"></i>
                  <div>
                    <h4 className="h5">13 Yıllık Deneyim</h4>
                    <p>Sektörde edindiğimiz tecrübe ile en zorlu problemlere bile çözüm üretiyoruz.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-people fs-4 me-3 text-primary"></i>
                  <div>
                    <h4 className="h5">Uzman Ekip</h4>
                    <p>Alanında uzman teknisyenlerimizle profesyonel hizmet sunuyoruz.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-award fs-4 me-3 text-primary"></i>
                  <div>
                    <h4 className="h5">Kalite Garantisi</h4>
                    <p>Tüm hizmetlerimizde müşteri memnuniyetini garanti ediyoruz.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Misyonumuz ve Vizyonumuz</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title h5 mb-3">
                    <i className="bi bi-bullseye text-primary me-2"></i>
                    Misyonumuz
                  </h3>
                  <p className="card-text">
                    Müşterilerimize en yüksek kalitede teknolojik çözümler sunarak, güvenlik ve bilişim ihtiyaçlarını en iyi şekilde karşılamak. Her zaman güncel teknolojileri takip ederek, en iyi hizmeti en uygun fiyatlarla sunmak.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title h5 mb-3">
                    <i className="bi bi-eye text-primary me-2"></i>
                    Vizyonumuz
                  </h3>
                  <p className="card-text">
                    Bölgemizde teknoloji ve güvenlik sistemleri alanında lider firma olmak. Sürekli gelişen teknolojiye ayak uydurarak, müşterilerimize en yenilikçi çözümleri sunmak ve sektörde örnek gösterilen bir kuruluş haline gelmek.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 