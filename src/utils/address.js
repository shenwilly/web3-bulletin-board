export function shortenAddress(value) {
    const beginning = value.substring(6, 16)
    const end = value.substring(value.length - 4)

    return beginning  + "..." + end
}