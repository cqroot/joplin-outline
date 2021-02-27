export function mdHeaders(noteBody:string) {
    const headers = [];
    const lines = noteBody.split('\n');
    let flag_block = false;
    let flag_comment = false;
    for (let line of lines) {
        // check code block
        if (line.match(/^(?:```)/)) {
            flag_block = !flag_block;
            continue
        }
        // check comment block
        if (line.match(/^(?:<!--)/)) {
            flag_comment = !flag_comment
            continue
        }
        if (flag_comment && line.match(/(?:-->)/)) {
            flag_comment = !flag_comment
            continue
        }
        if (flag_block || flag_comment) continue;

        // check header
        line = line.replace(/(\s#+)?$/, '');
        const match = line.match(/^(#+)\s(?:\[(.*)\]|(.*))/);
        if (!match) continue;
        if (match[1].length > 6) continue;
        headers.push({
            level: match[1].length,
            text: typeof(match[2]) === 'undefined' ? match[3] : match[2],
        });
    }
    return headers;
}
