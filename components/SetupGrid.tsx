import styles from "@/components/SetupGrid.module.css";

type HardwareItem = {
  icon: string;
  label: string;
  name: string;
  detail?: string;
  href?: string;
  featured?: boolean;
};

const hardware: HardwareItem[] = [
  { icon: "CPU", label: "Prozessor", name: "AMD Ryzen 7 7800X3D", detail: "8C / 16T · AM5 · 3D V-Cache", href: "https://geizhals.de/amd-ryzen-7-7800x3d-100-100000910wof-a2872148.html", featured: true },
  { icon: "GPU", label: "Grafikkarte", name: "MSI GeForce RTX 4070 Ti SUPER Ventus 3X OC", detail: "16 GB · GeForce RTX 40 SUPER", href: "https://geizhals.de/msi-geforce-rtx-4070-ti-super-16g-ventus-3x-oc-a3781093.html", featured: true },
  { icon: "MB", label: "Mainboard", name: "MSI X670E Gaming Plus WiFi", detail: "AMD X670E · AM5 · ATX · WiFi", href: "https://geizhals.de/msi-x670e-gaming-plus-wifi-7e16-001r-7e16-003r-a3086588.html" },
  { icon: "RAM", label: "Arbeitsspeicher", name: "Corsair Vengeance RGB · 32 GB", detail: "2 × 16 GB · DDR5", href: "https://geizhals.de/?fs=Corsair+Vengeance+RGB+32GB+2x16GB+DDR5" },
  { icon: "360", label: "Kühlung", name: "MSI MAG CoreLiquid E360", detail: "360-mm-AiO · 3 × 120 mm", href: "https://geizhals.de/msi-mag-coreliquid-e360-306-7zw6e11-c24-a3021565.html" },
  { icon: "850", label: "Netzteil", name: "be quiet! Pure Power 12 M · 850 W", detail: "80 PLUS Gold · vollmodular", href: "https://geizhals.de/be-quiet-pure-power-12-m-850w-atx-3-0-bn344-a2884020.html" },
  { icon: "CASE", label: "Gehäuse", name: "LC-Power Gaming 809B Dark Storm_X", detail: "Midi-Tower · Glas · ARGB", href: "https://geizhals.de/lc-power-gaming-809b-dark-storm-x-lc-809b-on-a3125683.html" },
  { icon: "SSD", label: "Speicher", name: "500 GB SSD · 1 TB SSD · 1 TB HDD", detail: "2,5 TB Gesamtspeicher" },
];

export function SetupGrid() {
  return (
    <>
      <div className={styles.grid}>
        {hardware.map((item) => {
          const className = `${styles.card} ${item.featured ? styles.featured : ""} ${!item.href ? styles.storage : ""}`;
          const content = (
            <>
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.copy}>
                <span className={styles.label}>{item.label}</span>
                <h3 className={styles.name}>{item.name}</h3>
                {item.detail && <span className={styles.detail}>{item.detail}</span>}
              </div>
              {item.href && <span className={styles.link}>GEIZHALS ↗</span>}
            </>
          );
          return item.href ? <a key={item.label} className={className} href={item.href} target="_blank" rel="noreferrer">{content}</a> : <article key={item.label} className={className}>{content}</article>;
        })}
      </div>
      <p className={styles.note}>Produktlinks führen zu Geizhals Deutschland. Beim RAM führt der Link noch zur passenden Suche, bis die exakte Variante feststeht.</p>
    </>
  );
}