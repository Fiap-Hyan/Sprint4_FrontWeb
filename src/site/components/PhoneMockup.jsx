const PhoneMockup = ({ children }) => (
  <figure className="phone-mockup" aria-hidden="true">
    <div className="phone-brilho" />
    <div className="phone-corpo">
      <span className="phone-notch" />
      <div className="mock-tela">{children}</div>
    </div>
  </figure>
)

export default PhoneMockup
