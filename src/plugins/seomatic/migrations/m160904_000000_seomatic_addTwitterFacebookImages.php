<?php
namespace Craft;

/**
 * The class name is the UTC timestamp in the format of mYYMMDD_HHMMSS_pluginHandle_migrationName
 */
class m160904_000000_seomatic_addTwitterFacebookImages extends BaseMigration
{
	/**
	 * Any migration code in here is wrapped inside of a transaction.
	 *
	 * @return bool
	 */
	public function safeUp()
	{

		// specify columns and AttributeType
		$newColumns = array (
			'seoTwitterImageId' => ColumnType::Int,
			'seoFacebookImageId' => ColumnType::Int
		);

		$this->_addColumnsAfter("seomatic_meta", $newColumns, "seoImageId");

		// specify columns and AttributeType
		$newColumns = array (
            'siteSeoTwitterImageId' => ColumnType::Int,
            'siteSeoFacebookImageId' => ColumnType::Int
		);

		$this->_addColumnsAfter("seomatic_settings", $newColumns, "siteSeoImageId");

		// return true and let craft know its done
		return true;
	}

	private function _addColumnsAfter($tableName, $newColumns, $afterColumnHandle)
	{

		// this is a foreach loop, enough said
		foreach ($newColumns as $columnName => $columnType)
		{
			// check if the column does NOT exist
			if (!craft()->db->columnExists($tableName, $columnName))
			{
				$this->addColumnAfter($tableName, $columnName, array(
					'column' => $columnType,
					'null'   => true,
					),
					$afterColumnHandle
				);

				// log that we created the new column
				SeomaticPlugin::log("Created the `$columnName` in the `$tableName` table.", LogLevel::Info, true);

			}

			// if the column already exists in the table
			else {

				// tell craft that we couldn't create the column as it alredy exists.
				SeomaticPlugin::log("Column `$columnName` already exists in the `$tableName` table.", LogLevel::Info, true);

			}
		}
	}
}
