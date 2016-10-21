function getFeatureName (featurePath) {
    return featurePath.replace(/^.*features/, '').substr(1);
}

export default getFeatureName;
