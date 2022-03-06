use hurl_core::error::Error;
use hurl_core::parser;
use hurlfmt::format;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse(s: &str) -> Result<String, String> {
    let hurl_file = parser::parse_hurl_file(s).map_err(|err| err.description())?;
    let output = format::format_json(hurl_file);
    return Ok(output);
}
