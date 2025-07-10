import "../../styles/sponsor_register.css";
export default function SponsorRegister() {
  return (
    <section className="sponsor-register-section">
      <h2 className="title">Sponsor Register</h2>
      <p className="subtitle">
        If you want to donate or support us, let's fill the application below
      </p>
      <form className="form">
        <input type="text" placeholder="Your Company Name" required />
        <input type="text" placeholder="Nature of Business" required />
        <div className="input-group">
          <input type="text" placeholder="Address" required />
          <input type="text" placeholder="Postcode" required />
        </div>
        <input type="text" placeholder="Contact Name" required />
        <input type="text" placeholder="Contact Phone" required />
        <input type="email" placeholder="Email" required />
        <input type="text" placeholder="Tax Number" />
        <textarea placeholder="Let's talk about your idea" rows={4} />

        <label className="upload-label">
          Upload Additional file
          <input type="file" style={{ display: "none" }} />
        </label>

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>

        <label className="nda-label">
          <input type="checkbox" />
          I want to protect my data by signing an NDA
        </label>
      </form>

      <div className="info-section">
        <h4>Offices</h4>
        <p>Han Thuyen Street, Linh Trung, Thu Duc, Ho Chi Minh City</p>
        <p>140/10 Dinh Bo Linh Street, 26 Ward, Binh Thanh District, Ho Chi Minh City</p>

        <h4>For Quick Inquiries</h4>
        <p>🇬🇧 +44 7777777777</p>
        <p>🇺🇸 +1 3333333330</p>

        <h4>Would you like to join our newsletter?</h4>
        <div className="newsletter">
          <input type="email" placeholder="Email" />
          <button>✓</button>
        </div>
      </div>
    </section>
  );
}
