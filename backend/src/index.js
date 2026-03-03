/**
 * Punto de Entrada de la Aplicación
 * Main Entry Point
 */

require('dotenv').config();
const serverConfig = require('./config/server.config');
const { getInstance: getDbConnection } = require('./infrastructure/database/connection');

// Repositories
const UserRepository = require('./infrastructure/repositories/UserRepository');
const FinancialRepository = require('./infrastructure/repositories/FinancialRepository');

// Use Cases
const LoginUseCase = require('./application/use-cases/auth/LoginUseCase');
const GetAllFinancialDataUseCase = require('./application/use-cases/financial/GetAllFinancialDataUseCase');
const GetSummaryUseCase = require('./application/use-cases/financial/GetSummaryUseCase');

// Controllers
const AuthController = require('./presentation/controllers/AuthController');
const FinancialController = require('./presentation/controllers/FinancialController');

// Routes
const routes = require('./presentation/routes');
const dashboardRoutes = require('./presentation/routes/dashboard.routes');

// App
const App = require('./app');

/**
 * Inicializar aplicación
 */
async function startServer() {
  try {
    console.log('🚀 Iniciando servidor...\n');

    // Conectar a la base de datos
    const dbConnection = getDbConnection();
    await dbConnection.connect();

    // Inicializar repositorios
    const userRepository = new UserRepository(dbConnection);
    const financialRepository = new FinancialRepository(dbConnection);

    // Inicializar casos de uso
    const loginUseCase = new LoginUseCase(userRepository);
    const getAllFinancialDataUseCase = new GetAllFinancialDataUseCase(financialRepository);
    const getSummaryUseCase = new GetSummaryUseCase(financialRepository);

    // Inicializar controladores
    const authController = new AuthController(loginUseCase);
    const financialController = new FinancialController(
      getAllFinancialDataUseCase,
      getSummaryUseCase
    );

    // Configurar rutas
    const appRoutes = routes(authController, financialController);
    appRoutes.dashboard = dashboardRoutes;

    // Crear aplicación
    const app = new App(appRoutes);
    const expressApp = app.getApp();

    // Iniciar servidor
    expressApp.listen(serverConfig.port, () => {
      console.log('✅ Servidor iniciado correctamente');
      console.log(`📡 Puerto: ${serverConfig.port}`);
      console.log(`🌍 URL: http://localhost:${serverConfig.port}`);
      console.log(`🗄️  Base de datos: data_dashboard`);
      console.log(`\n📚 Endpoints disponibles:`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   POST   /api/auth/logout`);
      console.log(`   GET    /api/auth/verify`);
      console.log(`   GET    /api/financial/all`);
      console.log(`   GET    /api/financial/summary`);
      console.log(`   GET    /api/financial/category/:category`);
      console.log(`   GET    /api/dashboard/summary`);
      console.log(`   GET    /api/dashboard/:type`);
      console.log(`   POST   /api/dashboard/load-csv`);
      console.log(`\n👤 Usuarios de prueba:`);
      console.log(`   admin / admin123`);
      console.log(`   analista / analista123`);
      console.log(`   viewer / viewer123\n`);
    });

    // Manejo de cierre graceful
    process.on('SIGINT', async () => {
      console.log('\n🛑 Cerrando servidor...');
      await dbConnection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar
startServer();
