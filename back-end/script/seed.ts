
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('🌱 Iniciando seed de base de datos...\n');

  try {
    // ============================================
    // 1. INSERTAR CLIENTES
    // ============================================
    console.log('📦 Insertando clientes...');
    
    const clientes = [
      { ruc: '20123456789', razon_social: 'Tienda Fashion Style S.A.C.', nombre_comercial: 'Fashion Style', email: 'ventas@fashionstyle.com', telefono: '987654321', direccion: 'Av. La Moda 123, San Isidro, Lima', activo: true },
      { ruc: '20234567890', razon_social: 'Boutique Elegance EIRL', nombre_comercial: 'Elegance', email: 'contacto@elegance.pe', telefono: '987654322', direccion: 'Jr. Las Flores 456, Miraflores, Lima', activo: true },
      { ruc: '20345678901', razon_social: 'Moda Joven Peru S.A.', nombre_comercial: 'Moda Joven', email: 'info@modajoven.pe', telefono: '987654323', direccion: 'Av. Universitaria 789, San Miguel, Lima', activo: true },
      { ruc: '20456789012', razon_social: 'Urban Style Boutique S.A.C.', nombre_comercial: 'Urban Style', email: 'pedidos@urbanstyle.com', telefono: '987654324', direccion: 'Calle Comercio 321, Barranco, Lima', activo: true },
      { ruc: '20567890123', razon_social: 'Tendencias del Sur EIRL', nombre_comercial: 'Tendencias', email: 'ventas@tendenciasdelsur.com', telefono: '987654325', direccion: 'Av. Larco 654, Miraflores, Lima', activo: true },
      { ruc: '20678901234', razon_social: 'Distribuidora Textil Lima S.A.', nombre_comercial: 'DTL', email: 'compras@dtlima.com', telefono: '987654326', direccion: 'Av. Argentina 1234, Callao', activo: true },
      { ruc: '20789012345', razon_social: 'Importaciones Fashion World S.A.C.', nombre_comercial: 'Fashion World', email: 'pedidos@fashionworld.pe', telefono: '987654327', direccion: 'Jr. Gamarra 567, La Victoria, Lima', activo: true },
      { ruc: '20890123456', razon_social: 'Mayorista Ropa Perú EIRL', nombre_comercial: 'MRP', email: 'ventas@mrperu.com', telefono: '987654328', direccion: 'Av. Grau 890, Cercado de Lima', activo: true },
      { ruc: '20901234567', razon_social: 'Boutique María E.I.R.L.', nombre_comercial: 'Boutique María', email: 'maria@boutiquemaria.com', telefono: '987654329', direccion: 'Calle Principal 123, Jesús María, Lima', activo: true },
      { ruc: '21012345678', razon_social: 'Closet Chic S.A.C.', nombre_comercial: 'Closet Chic', email: 'info@closetchic.pe', telefono: '987654330', direccion: 'Av. República 456, San Isidro, Lima', activo: true },
      { ruc: '21123456789', razon_social: 'E-commerce Fashion Peru S.A.', nombre_comercial: 'Fashion Peru', email: 'ventas@fashionperu.com', telefono: '987654331', direccion: 'Av. Javier Prado 789, San Isidro, Lima', activo: true },
      { ruc: '21234567890', razon_social: 'Tienda Virtual Style Now EIRL', nombre_comercial: 'Style Now', email: 'contacto@stylenow.pe', telefono: '987654332', direccion: 'Calle Los Alamos 234, Surco, Lima', activo: true },
      { ruc: '21345678901', razon_social: 'Uniformes Empresariales S.A.C.', nombre_comercial: 'UE SAC', email: 'uniformes@empresariales.com', telefono: '987654333', direccion: 'Av. Industrial 567, Ate, Lima', activo: true },
      { ruc: '21456789012', razon_social: 'Corporación Textil Andina S.A.', nombre_comercial: 'CTA', email: 'compras@textilsandina.com', telefono: '987654334', direccion: 'Jr. Colmena 890, Cercado de Lima', activo: true },
      { ruc: '21567890123', razon_social: 'Confecciones Premium S.A.C.', nombre_comercial: 'Premium', email: 'pedidos@premium.pe', telefono: '987654335', direccion: 'Av. Colonial 1234, Callao', activo: true },
    ];

    for (const cliente of clientes) {
      const { error } = await supabase.from('clientes').upsert(cliente, { onConflict: 'ruc' });
      if (error) console.error(`❌ Error insertando cliente ${cliente.nombre_comercial}:`, error.message);
    }
    
    console.log(`✅ ${clientes.length} clientes insertados\n`);

    // ============================================
    // 2. INSERTAR CATEGORÍAS
    // ============================================
    console.log('📂 Insertando categorías...');
    
    const categorias = [
      { nombre: 'Vestidos', descripcion: 'Vestidos casuales, formales y de diferentes estilos para toda ocasión', activo: true },
      { nombre: 'Faldas', descripcion: 'Faldas de diversos cortes: A, recta, plisada, midi y mini', activo: true },
      { nombre: 'Blusas y Tops', descripcion: 'Blusas, camisetas, tops y polos para uso diario y ocasiones especiales', activo: true },
      { nombre: 'Pantalones', descripcion: 'Pantalones casuales, jeans, cargo y formales', activo: true },
      { nombre: 'Chaquetas y Abrigos', descripcion: 'Chaquetas, casacas, abrigos y prendas de abrigo', activo: true },
      { nombre: 'Sweaters y Chompas', descripcion: 'Suéteres, chompas y prendas de punto para clima frío', activo: true },
      { nombre: 'Conjuntos', descripcion: 'Sets coordinados de dos o más piezas', activo: true },
      { nombre: 'Ropa Aesthetic', descripcion: 'Prendas con estilo aesthetic, urbano y moderno', activo: true },
    ];

    const categoriasInsertadas = [];
    for (const categoria of categorias) {
      const { data, error } = await supabase
        .from('categorias')
        .upsert(categoria, { onConflict: 'nombre' })
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error insertando categoría ${categoria.nombre}:`, error.message);
      } else if (data) {
        categoriasInsertadas.push(data);
      }
    }
    
    console.log(`✅ ${categoriasInsertadas.length} categorías insertadas\n`);

    // Crear mapa de categorías por nombre
    const catMap: Record<string, number> = {};
    categoriasInsertadas.forEach(cat => {
      catMap[cat.nombre] = cat.id;
    });

    // ============================================
    // 3. INSERTAR PRODUCTOS
    // ============================================
    console.log('🛍️  Insertando productos...');

    const productos = [
      // VESTIDOS
      { nombre: 'Vestido Sin Mangas Tirantes Volantes Negro', descripcion: 'Vestido casual negro con tirantes delgados y detalles de volantes en el dobladillo. Perfecto para verano.', categoria_id: catMap['Vestidos'], precio: 79.90, stock: 25, stock_minimo: 5, imagen: 'products/Vestido_Sin_Mangas_Tirantes_de_Volante_Liso.jpg', estado: true },
      { nombre: 'Vestido Casual de Verano para Mujer', descripcion: 'Vestido ligero y fresco ideal para días cálidos. Diseño versátil y cómodo.', categoria_id: catMap['Vestidos'], precio: 89.90, stock: 30, stock_minimo: 5, imagen: 'products/Vestido_casual_de_verano_para_mujer.jpg', estado: true },
      { nombre: 'Vestido de Tirantes con Bolsillos Negro', descripcion: 'Vestido práctico con bolsillos laterales funcionales. Estilo minimalista y elegante.', categoria_id: catMap['Vestidos'], precio: 85.90, stock: 20, stock_minimo: 5, imagen: 'products/Vestido_de_tirantes_con_bolsillos_negro.jpg', estado: true },
      { nombre: 'Vestido Jean Azul', descripcion: 'Vestido de mezclilla azul clásico. Diseño atemporal y duradero.', categoria_id: catMap['Vestidos'], precio: 95.90, stock: 18, stock_minimo: 5, imagen: 'products/vestido_jean_azul.jpg', estado: true },
      { nombre: 'Vestido Verge Pastel', descripcion: 'Vestido en tonos pastel suaves. Perfecto para look romántico y femenino.', categoria_id: catMap['Vestidos'], precio: 99.90, stock: 15, stock_minimo: 5, imagen: 'products/vestido_verge_pastel.jpg', estado: true },

      // FALDAS
      { nombre: 'Falda de Línea A Simple y Casual', descripcion: 'Falda corte A clásica perfecta para uso diario. Versátil y cómoda.', categoria_id: catMap['Faldas'], precio: 59.90, stock: 35, stock_minimo: 8, imagen: 'products/Falda_de_linea_A_simple_y_casual.jpg', estado: true },
      { nombre: 'Falda Azul con Flores', descripcion: 'Falda con estampado floral en tono azul vibrante. Diseño fresco y primaveral.', categoria_id: catMap['Faldas'], precio: 65.90, stock: 28, stock_minimo: 8, imagen: 'products/falda_azul_con_flores.jpg', estado: true },
      { nombre: 'Falda Negro Puntos Blancos', descripcion: 'Falda clásica con estampado de lunares. Estilo vintage atemporal.', categoria_id: catMap['Faldas'], precio: 55.90, stock: 32, stock_minimo: 8, imagen: 'products/falda_negro_puntos_blancos.jpg', estado: true },

      // BLUSAS Y TOPS
      { nombre: 'Asymmetric Hem Crop Tank Top', descripcion: 'Top crop con dobladillo asimétrico. Estilo urbano y moderno.', categoria_id: catMap['Blusas y Tops'], precio: 39.90, stock: 45, stock_minimo: 10, imagen: 'products/Asymmetric_Hem_Crop_Tank_Top.jpg', estado: true },
      { nombre: 'Girls Belted Button Front Ruffle Hem Top', descripcion: 'Top con botones frontales y volantes en el dobladillo. Incluye cinturón.', categoria_id: catMap['Blusas y Tops'], precio: 52.90, stock: 30, stock_minimo: 10, imagen: 'products/Girls_Belted_Button_Front_Ruffle_Hem_Top.jpg', estado: true },
      { nombre: 'Girls Colour Block Ringer Drop Shoulder Tee', descripcion: 'Camiseta con bloques de color y hombros caídos. Estilo deportivo casual.', categoria_id: catMap['Blusas y Tops'], precio: 42.90, stock: 38, stock_minimo: 10, imagen: 'products/girls_colour_bloc_drop_shoulder_tee.jpg', estado: true },
      { nombre: 'Camiseta Marrón Pastel', descripcion: 'Camiseta básica en tono marrón pastel. Esencial para cualquier guardarropa.', categoria_id: catMap['Blusas y Tops'], precio: 45.90, stock: 35, stock_minimo: 10, imagen: 'products/camiseta_marron_pastel.jpg', estado: true },

      // PANTALONES
      { nombre: 'Pantalón Cargo Blanco', descripcion: 'Pantalón cargo estilo urbano en color blanco. Múltiples bolsillos funcionales.', categoria_id: catMap['Pantalones'], precio: 89.90, stock: 22, stock_minimo: 6, imagen: 'products/pantalon_cargo_blanco.jpg', estado: true },
      { nombre: 'Pantalón Cargo Negro', descripcion: 'Pantalón cargo negro clásico. Estilo militar urbano.', categoria_id: catMap['Pantalones'], precio: 89.90, stock: 28, stock_minimo: 6, imagen: 'products/pantalon_cargo_negro.jpg', estado: true },
      { nombre: 'Jeans Azul con Lazo', descripcion: 'Jeans azul con detalle de lazo decorativo. Diseño femenino y único.', categoria_id: catMap['Pantalones'], precio: 85.90, stock: 24, stock_minimo: 6, imagen: 'products/jeans_azul_con_lazo_jean.jpg', estado: true },

      // CHAQUETAS
      { nombre: 'Jacket Crema con Marrón', descripcion: 'Chaqueta bicolor en tonos crema y marrón. Diseño moderno y elegante.', categoria_id: catMap['Chaquetas y Abrigos'], precio: 129.90, stock: 15, stock_minimo: 4, imagen: 'products/jacket_crema_con_marron.jpg', estado: true },
      { nombre: 'Jacket Gris', descripcion: 'Chaqueta gris clásica atemporal. Esencial para clima frío.', categoria_id: catMap['Chaquetas y Abrigos'], precio: 115.90, stock: 20, stock_minimo: 4, imagen: 'products/jacket_gris.jpg', estado: true },

      // SWEATERS
      { nombre: 'Sweater Tricolores Pastel', descripcion: 'Suéter con rayas horizontales en colores pastel suaves. Diseño juvenil.', categoria_id: catMap['Sweaters y Chompas'], precio: 79.90, stock: 25, stock_minimo: 6, imagen: 'products/sweater_tricolores_pastel.jpg', estado: true },
      { nombre: 'Sweaters Azul Claro', descripcion: 'Suéter azul claro en tejido suave y cálido. Perfecta para invierno.', categoria_id: catMap['Sweaters y Chompas'], precio: 75.90, stock: 28, stock_minimo: 6, imagen: 'products/sweaters_azul_claro.jpg', estado: true },
      { nombre: 'Sweaters Rosado', descripcion: 'Suéter rosa femenino en tejido de punto. Suave y confortable.', categoria_id: catMap['Sweaters y Chompas'], precio: 75.90, stock: 30, stock_minimo: 6, imagen: 'products/sweaters_rosado.jpg', estado: true },

      // AESTHETIC
      { nombre: 'Prenda Aesthetic', descripcion: 'Prenda estilo aesthetic moderno con diseño único. Perfecta para look urbano.', categoria_id: catMap['Ropa Aesthetic'], precio: 89.90, stock: 18, stock_minimo: 5, imagen: 'products/prenda_aesthetic.jpg', estado: true },
      { nombre: 'Prenda Verde Mujer', descripcion: 'Prenda verde estilo casual aesthetic. Color fresco y juvenil.', categoria_id: catMap['Ropa Aesthetic'], precio: 85.90, stock: 22, stock_minimo: 5, imagen: 'products/prenda_verde_mujer.jpg', estado: true },
    ];

    let productosInsertados = 0;
    for (const producto of productos) {
      const { error } = await supabase.from('productos').insert(producto);
      if (error) {
        console.error(`❌ Error insertando producto ${producto.nombre}:`, error.message);
      } else {
        productosInsertados++;
      }
    }
    
    console.log(`✅ ${productosInsertados} productos insertados\n`);

    // ============================================
    // RESUMEN FINAL
    // ============================================
    console.log('✨ Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   • Clientes: ${clientes.length}`);
    console.log(`   • Categorías: ${categoriasInsertadas.length}`);
    console.log(`   • Productos: ${productosInsertados}`);
    
  } catch (error) {
    console.error('💥 Error durante el seed:', error);
    process.exit(1);
  }
}

seedDatabase().then(() => {
  console.log('\n🎉 Proceso completado!');
  process.exit(0);
}); 