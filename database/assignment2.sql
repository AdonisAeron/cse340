-- Create Tony Stark account
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- Update Tony Stark account to Admin 
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_id = 1;


-- Delete Tony Stark from the database
DELETE FROM public.account
WHERE account_id = 1;

--Modify the "GM Hummer" record
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') 
WHERE inv_id = 10;

--Select make, model, and classification for "Sport" category using inner join
SELECT  inv_make, inv_model, classification_name
FROM public.inventory inv
INNER JOIN public.classification cls
	ON inv.classification_id = cls.classification_id
WHERE inv.classification_id = 2;

-- Update all records in inventory to add '/vehicles' to the middle of the file path in the inv_image and the inv_thumbnail columns
UPDATE public.inventory
SET
inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');
