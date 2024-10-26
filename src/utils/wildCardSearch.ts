// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export default function wildCardSearch(
    list: Array<Record<string, string | number>>,
    input: string,
    specifyKey?: string,
) {
    const searchText = (item: Record<string, string | number>) => {
        for (const key in item) {
            if (item[specifyKey ? specifyKey : key] == null) {
                continue
            }
            if (
                item[specifyKey ? specifyKey : key]
                    .toString()
                    .toUpperCase()
                    .indexOf(input.toString().toUpperCase()) !== -1
            ) {
                return true
            }
        }
    }
    const result = list.filter((value) => searchText(value))
    return result
}


// Update the function to accept a generic type T that extends a Record with string keys.
export  function wildCardSearch2<T extends Record<string, any>>(
    list: T[],
    input: string,
    specifyKey?: keyof T,
): T[] {
    const searchText = (item: T) => {
        for (const key in item) {
            // Use type guards to ensure the property exists and is of type string or number
            const value = item[specifyKey ? specifyKey : key];
            if (value == null) {
                continue;
            }
            if (
                value.toString().toUpperCase().indexOf(input.toString().toUpperCase()) !== -1
            ) {
                return true;
            }
        }
        return false;
    };
    return list.filter((value) => searchText(value));
}
