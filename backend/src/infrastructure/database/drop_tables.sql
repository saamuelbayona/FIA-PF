-- Script para ELIMINAR todas las tablas
-- Ejecuta este script PRIMERO en HeidiSQL

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS auditoria_merma;
DROP TABLE IF EXISTS fuentes_usos;
DROP TABLE IF EXISTS gestion_cartera;
DROP TABLE IF EXISTS gestion_humana_personal;
DROP TABLE IF EXISTS gestion_humana_costos;
DROP TABLE IF EXISTS gestion_humana_retiros;
DROP TABLE IF EXISTS gestion_humana_horas;
DROP TABLE IF EXISTS gestion_logistica;
DROP TABLE IF EXISTS produccion_encasetado;
DROP TABLE IF EXISTS produccion_granjas;
DROP TABLE IF EXISTS gestion_comercial_ventas;
DROP TABLE IF EXISTS equipo_ventas;
DROP TABLE IF EXISTS sistema_sagrilaft;
DROP TABLE IF EXISTS gestion_gerencia;

-- Tablas antiguas que puedan existir
DROP TABLE IF EXISTS gestion_humana;
DROP TABLE IF EXISTS produccion;
DROP TABLE IF EXISTS gestion_comercial;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Todas las tablas han sido eliminadas' AS mensaje;
