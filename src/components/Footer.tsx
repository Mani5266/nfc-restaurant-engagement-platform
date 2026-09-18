export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="px-5 md:px-8 py-6 text-center border-t border-border-light"
      role="contentinfo"
    >
      <p className="text-warm-gray text-xs font-body">
        Powered by{" "}
        <span className="font-semibold text-deep-green">TapDine</span>
      </p>
      <p className="text-warm-gray/60 text-[10px] mt-1 font-body">
        &copy; {currentYear} All rights reserved
      </p>
    </footer>
  );
}
