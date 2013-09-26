--
-- TAble `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- Data dump of `tags`
--

INSERT INTO `tags` (`id`, `title`) VALUES
(1, 'cities'),
(2, 'streets'),
(4, 'houses'),
(5, 'flats'),
(6, 'phones'),
(7, 'comps'),
(8, 'windows'),
(9, 'kitchens'),
(10, 'spoons'),
(11, 'carpets'),
(12, 'boxes'),
(13, 'shampoos'),
(14, 'brushes'),
(15, 'screens'),
(16, 'books'),
(17, 'bottles'),
(18, 'tables'),
(19, 'desks'),
(20, 'discs'),
(21, 'tablets'),
(23, 'toys'),
(24, 'pencils'),
(26, 'cups'),
(29, 'buskets');
