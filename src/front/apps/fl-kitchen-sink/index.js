import React, { Fragment } from 'react'
import {
    ScreenHeader,
    ExpandedContents,
    TagGroup,
    Tag,
    Padding,
    Separator,
    Heading,
    Icon,
} from 'components'

export const KitchenSinkTab = props => {
    return (
        <Fragment>
            <ScreenHeader>
                These are examples of different UI components. Check out the `fl-kitchen-sink` app for details.
                <ExpandedContents>Made Ya Look!</ExpandedContents>
            </ScreenHeader>

            <Padding>
                <Heading>Tags & Tag Groups</Heading>
                <TagGroup title="Normal Tag Group">
                    <Tag>One</Tag>
                    <Tag isSelected={true}>Two (selected)</Tag>
                    <Tag>Three</Tag>
                    <Tag count="23">Four (with count)</Tag>
                    <Tag>Five</Tag>
                </TagGroup>
                <TagGroup title="Muted (appearance) Tag Group" appearance="muted">
                    <Tag isSelected={true}>Alligator (selected)</Tag>
                    <Tag>Squirrel</Tag>
                    <Tag>Turtle</Tag>
                    <Tag count="23">Cow (with count)</Tag>
                    <Tag>Gopher</Tag>
                    <Tag count="13,203">Armadillo</Tag>
                </TagGroup>
                <TagGroup title="Vibrant (appearance) Tag Group" appearance="vibrant">
                    <Tag>One</Tag>
                    <Tag>Two</Tag>
                    <Tag>Three</Tag>
                    <Tag count="23">Four (with count)</Tag>
                    <Tag isSelected={true}>Five (selected)</Tag>
                </TagGroup>
            </Padding>
            <Separator />
        </Fragment>
    )
}

export const KitchenSinkIcon = props => {
    return (

<svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(-229.000000, -145.000000)">
            <path d="M253,167.010842 L254.014075,167.010842 C255.118644,167.010842 256.014075,166.115411 256.014075,165.010842 L256.014075,148 C256.014075,146.895431 255.118644,146 254.014075,146 C250.792225,146 249.443621,146 248,146 M234.5,146 C234.277778,146 232.444444,146 232,146 C230.895431,146 230,146.895431 230,148 L230,165.010842 C230,166.115411 230.895431,167.010842 232,167.010842 L233,167.010842"></path>
            <path d="M242.5,151 L242.5,154"></path>
            <path d="M243.5,159 L243.5,160"></path>
            <path d="M245.5,155 L245.5,157"></path>
            <path d="M234,160 C234,164.666667 237,167 243,167 C249,167 252,164.666667 252,160"></path>
            <polyline points="238.5 166 238.5 146 244 146 244 147.913793"></polyline>
        </g>
    </g>
</svg>
    )
}
