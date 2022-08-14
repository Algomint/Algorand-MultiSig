package db

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DbConnection *gorm.DB

func InitiateDbClient() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("data/sqlite.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	if err := CreateTable(db); err != nil {
		return nil, err
	}
	return db, nil
}

func CreateTable(db *gorm.DB) error {
	const rawQueryCreateSignedTxn = "CREATE TABLE IF NOT EXISTS SignedTxn ( " +
		"id INTEGER PRIMARY KEY AUTOINCREMENT," +
		"signer_public_address TEXT NOT NULL, " +
		"signed_transaction TEXT NOT NULL, " +
		"txn_id TEXT NOT NULL)"

	tx := db.Exec(rawQueryCreateSignedTxn)
	if tx.Error != nil {
		return tx.Error
	}

	const rawQueryCreateTxn = "CREATE TABLE IF NOT EXISTS RawTransaction (" +
		"raw_transaction TEXT NOT NULL UNIQUE, " +
		"txn_id TEXT PRIMARY KEY NOT NULL, " +
		"number_of_signs_required INTEGER NOT NULL, " +
		"signers_threshold INTEGER NOT NULL, " +
		"number_of_signs_total INTEGER NOT NULL, " +
		"version required INTEGER NOT NULL, " +
		"status TEXT );"

	tx = db.Exec(rawQueryCreateTxn)
	if tx.Error != nil {
		return tx.Error
	}

	const rawQueryCreateSignerAddress = "CREATE TABLE IF NOT EXISTS SignerAddress (" +
		"id INTEGER PRIMARY KEY AUTOINCREMENT," +
		"sign_txn_id TEXT NOT NULL," +
		"signer_address TEXT, " +
		"CONSTRAINT fk_txn_id " +
		"FOREIGN KEY (sign_txn_id) " +
		"REFERENCES RawTransaction(txn_id) );"

	tx = db.Exec(rawQueryCreateSignerAddress)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}
