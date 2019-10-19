export const updateObject = (oldObject, objectProperties) => {
	return {
		...oldObject,
		...objectProperties
	};
};
