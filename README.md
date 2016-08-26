# JSON Schema Faker extension for Paw
JSON Schema Faker combines the power of JSON Schemas with the power of Faker.js
to create the most accurate fake data you may want to generate.

## Introduction to using Faker with JSON Schema
JSON schemas are pretty amazing when it comes to describing the overall architecture of a JSON object. This makes it a very helpful tool to describe what your API expects and returns.

Thanks to json-schema-faker, you can automatically generate data that is in line with what your API expects. The JSON Schema faker tries to make the most out of Faker.js and allows you to integrate it in a very simple fashion, because who doesn't prefer having 'Mittie15@example.com' instead of '2vNiY7VNko@csJmI.com' ?


## Table of Content
- [Faker Cheat Sheet](#faker-cheat-sheet)
    - [Faker fake](#-faker-fake)
    - [Faker API Reference](#-faker-api-reference)
- [JSON Schema Quickstart](#json-schema-quickstart)
    - [JSON Schema Introduction](#json-schema-introduction)
    - [JSON Schema types](#json-schema-types)
        - [integer](#integer)
        - [number](#number)
        - [string](#string)
        - [boolean](#boolean)
        - [array](#array)
        - [object](#object)

## Faker Cheat Sheet
This is a shameless copy of the original documentation at [Faker.js](http://marak.github.io/faker.js/)

### Faker fake
faker.js contains a super useful generator method Faker.fake for combining faker API methods using a mustache string format.

```
{
    "title": "offer",
    "type": "string",
    "faker": {
        "fake": "{{commerce.product}} made in {{address.country}} for only ${{commerce.price}}!"
    }
}
```

### Faker API reference
The way to include faker in json schemas for these apis is slightly different from that of `faker.fake`

```
{
    "title": "email address",
    "type": "string",
    "faker": "internet.email"
}
```

This structure can be used with the following values:

- address
    - zipCode
    - city
    - cityPrefix
    - citySuffix
    - streetName
    - streetAddress
    - streetSuffix
    - streetPrefix
    - secondaryAddress
    - county
    - country
    - countryCode
    - state
    - stateAbbr
    - latitude
    - longitude
- commerce
    - color
    - department
    - productName
    - price
    - productAdjective
    - productMaterial
    - product
- company
    - suffixes
    - companyName
    - companySuffix
    - catchPhrase
    - bs
    - catchPhraseAdjective
    - catchPhraseDescriptor
    - catchPhraseNoun
    - bsAdjective
    - bsBuzz
    - bsNoun
- date
    - past
    - future
    - between
    - recent
    - month
    - weekday
- finance
    - account
    - accountName
    - mask
    - amount
    - transactionType
    - currencyCode
    - currencyName
    - currencySymbol
    - bitcoinAddress
- hacker
    - abbreviation
    - adjective
    - noun
    - verb
    - ingverb
    - phrase
- image
    - image
    - avatar
    - imageUrl
    - abstract
    - animals
    - business
    - cats
    - city
    - food
    - nightlife
    - fashion
    - people
    - nature
    - sports
    - technics
    - transport
- internet
    - avatar
    - email
    - exampleEmail
    - userName
    - protocol
    - url
    - domainName
    - domainSuffix
    - domainWord
    - ip
    - userAgent
    - color
    - mac
    - password
- lorem
    - word
    - words
    - sentence
    - sentences
    - paragraph
    - paragraphs
    - text
    - lines
- name
    - firstName
    - lastName
    - findName
    - jobTitle
    - prefix
    - suffix
    - title
    - jobDescriptor
    - jobArea
    - jobType
- phone
    - phoneNumber
    - phoneNumberFormat
    - phoneFormats
- random
    - number
    - arrayElement
    - objectElement
    - uuid
    - boolean
    - word
    - words
    - image
    - locale
    - alphaNumeric
- system
    - fileName
    - commonFileName
    - mimeType
    - commonFileType
    - commonFileExt
    - fileType
    - fileExt
    - directoryPath
    - filePath
    - semver

## JSON Schema Quickstart
If you are not very familiar with JSON Schemas, this should help you get the basics.

The guys at the [Space Telescope Science Institute](https://github.com/spacetelescope) have made an awesome documentation about JSON Schemas, that's infinitely better than anything I could produce, and that you should [definitely check out](https://spacetelescope.github.io/understanding-json-schema/)

This extension is not fully compliant with the more advanced use of JSON Schemas, unfortunately.

### JSON Schema Introduction
JSON Schemas are used to describe the constraints a JSON object should respect.
For instance, the schema

```
{
    "type": "string",
    "maxLength": 4
}
```

will describe strings of at most 4 characters. For instance, the '1@xG' is valid
against this schema.

### JSON Schema types
Note that you do not have to use all fields every time.

#### integer
```
{
    "title": "demo",
    "type": "integer" // 4799920192,
    "minimum": 0,
    "maximum": 10000000000,
    "exclusiveMinimum": true,
    "exclusiveMaximum": false,
    "enum":  [ 4799920192, -47992, 479991, 4799920192000000 ],
    "multipleOf": 2
}
```
#### number
```
{
    "title": "demo",
    "type": "number" // 0.55
    "minimum": 0,
    "maximum": 1,
    "exclusiveMinimum": true,
    "exclusiveMaximum": false,
    "enum":  [ -0.131, 0.1231, 0.55, 1.1241 ],
    "multipleOf": 0.05
}
```

#### string
```
{
    "title": "demo",
    "type": "string" // 123@qwd
    "pattern": "^[0-9]+@[^0-9]+",
    "minLength": 5,
    "maxLength": 9,
    "enum":  [ "123@qwd", "1@p", "124121241@" ]
}
```

#### boolean
```
{
    "title": "demo",
    "type": "boolean" // false
    "enum":  [ false ]
}
```

#### array
```
{
    "title": "demo",
    "type": "array" // [ 1, 2, 4]
    "items": { // a schema describing each object in the array
        "type": "integer",
        "minimum": 0,
        "maximum": 10
    }
    "minItems": 2,
    "maxItems": 5,
    "uniqueItems": true,
    "enum":  [ [ 1, 2, 4 ], [ "a", "b", "c" ] ]
}
```

#### object
```
{
    "title": "bank account demo",
    "type": "object" // [ 1, 2, 4]
    "properties": {
        "account_id": { // a schema describing the object
            "type": "integer",
            "minimum": 0,
            "maximum": 10
        },
        "user_id" : { // a schema describing the object
            "type": "integer",
            "minimum": 0,
            "maximum": 10
        },
        "balance" : { // a schema describing the object
            "type": "integer",
            "minimum": -5000,
            "maximum": 25000
        }
    },
    "patternProperties": {
        "^(yearly|monthly|daily|hourly)_activity_log$" : {
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    },
    additionalProperties: false,
    "minProperties": 4,
    "maxProperties": 6,
    "required": [ "account_id", "balance", "user_id" ]
    // enum: [ {...} ] works too
}
```

## Development

### Prerequisites

```shell
npm install
```

### Build

```shell
npm run build
```

### Install

```shell
make install
```

### Test

```shell
npm test
```

## License

This Paw Extension is released under the [MIT License](LICENSE). Feel free to fork, and modify!

Copyright © 2016 Luckymarmot.com

## Credits

[JSON Schema Faker](https://github.com/json-schema-faker/json-schema-faker) also released under MIT.
[Faker.js](https://github.com/Marak/faker.js) also released under MIT.
