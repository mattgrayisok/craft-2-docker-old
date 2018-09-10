<?php

/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here.
 * You can see a list of the default settings in craft/app/etc/config/defaults/general.php
 */

return array(

	// Base site URL
	'siteUrl' => getenv('SITE_URL'),

	// Environment-specific variables (see https://craftcms.com/docs/multi-environment-configs#environment-specific-variables)
	'environmentVariables' => array(
		'siteUrl' => getenv('SITE_URL'),
	),

	'cdnPrefix' => getenv('CDN_PREFIX', ''),

	// Default Week Start Day (0 = Sunday, 1 = Monday...)
	'defaultWeekStartDay' => 1,

	// Enable CSRF Protection (recommended, will be enabled by default in Craft 3)
	'enableCsrfProtection' => true,

	// Whether "index.php" should be visible in URLs (true, false, "auto")
	'omitScriptNameInUrls' => true,

	// Control Panel trigger word
	'cpTrigger' => 'admin',

	// Dev Mode (see https://craftcms.com/support/dev-mode)
	'devMode' => getenv('DEV_MODE', false),

	'defaultFilePermissions' => 0666,

	'defaultFolderPermissions' => 0777,

	'overridePhpSessionLocation' => false,

	'allowAutoUpdates' => false,

	'defaultTemplateExtensions' => array('twig', 'html'),


);
