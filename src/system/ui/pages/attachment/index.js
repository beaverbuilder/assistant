import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { Page, Form, Button, Layout, Icon } from "ui";
import { getSrcSet } from "utils/image";
import { getWpRest } from "utils/wordpress";
import { getSystemActions } from "data";

export const Attachment = ({ location, history }) => {
	const { item } = location.state;
	const wpRest = getWpRest();
	const { setCurrentHistoryState } = getSystemActions();
	const { id, title, type, subtype } = item;
	const [responseMessage, setResponseMessage] = useState({
		message: "",
		status: "",
		icon: "",
	});
	const onSubmit = ({ changed, ids }) => {
		const data = {
			meta: {},
		};
		for (let key in changed) {
			if (!ids[key]) {
				continue;
			}
			data[ids[key]] = changed[key];
		}

		if ("title" in changed) {
			item.title = changed.title;
		}

		if ("alt" in changed) {
			item.alt = changed.alt;
			data.meta.alt = changed.alt;
		}

		if ("description" in changed) {
			item.description = changed.description;
		}

		const handleError = error => {
			setIsSubmitting(false);
			setResponseMessage({
				message: __("Error: Changes not saved! Please try again."),
				status: "destructive",
				icon: Icon.Reject,
			});
			if (error) {
				console.log(error); // eslint-disable-line no-console
			}
		};

		wpRest
			.attachments()
			.update(id, "data", data)
			.then(response => {
				const { data } = response;
				if (data.error) {
					handleError();
				} else {
					setCurrentHistoryState({ item });
					setIsSubmitting(false);
					setResponseMessage({
						message: __("Changes Saved!"),
						status: "alert",
						icon: Icon.Approve,
					});
				}
			})
			.catch(error => {
				handleError(error);
			});
	};

	const deleteAttchment = () => {
		if (confirm(__("Do you really want to delete this media?"))) {
			wpRest
				.attachments()
				.update(id, "trash")
				.then(() => {
					alert(__("Media permanently deleted!"));
				});
			history.goBack();
		}
	};

	const sections = {
		meta: {
			label: __("Metadata"),
			fields: {
				title: {
					label: __("Title"),
					id: "post_title",
				},
				alt: {
					label: __("Alternative Text"),
					id: "alt",
				},
				description: {
					label: __("Description"),
					component: "textarea",
					id: "post_content",
					rows: 4,
				},
			},
		},
		info: {
			label: __("Info"),
			fields: {
				filesize: {
					label: __("File size"),
					component: "plain-text",
					labelPlacement: "beside",
				},
				type: {
					label: __("File type"),
					component: "plain-text",
					labelPlacement: "beside",
				},
				date: {
					label: __("Uploaded on"),
					component: "plain-text",
					labelPlacement: "beside",
				},
				author: {
					label: __("Uploaded by"),
					component: "plain-text",
					labelPlacement: "beside",
				},
			},
		},
		links: {
			label: __("Links"),
			fields: {
				url: {
					label: __("File URL"),
					component: "url",
				},
				permalink: {
					label: __("URL"),
					component: "url",
				},
			},
		},
		actions: {
			label: __("Actions"),
			fields: {
				actions: {
					component: "actions",
					options: [
						{
							label: __("View Attachment"),
							href: item.permalink,
						},
						{
							label: __("Edit in Admin"),
							href: item.editUrl,
						},
						{
							label: __("Delete"),
							status: "destructive",
							onClick: deleteAttchment,
						},
					],
				},
			},
		},
	};

	const Footer = () => {
		return (
			<>
				{hasChanges && (
					<>
						<Button onClick={resetForm}>{__("Cancel")}</Button>
						<div style={{ flex: "1 1 auto", margin: "auto" }} />
						<Button type="submit" status="primary" onClick={submitForm}>
							{__("Save")}
						</Button>
					</>
				)}

				{responseMessage.message && !hasChanges && (
					<>
						<Layout.Message
							status={responseMessage.status}
							icon={responseMessage.icon}
						>
							{responseMessage.message}
						</Layout.Message>
					</>
				)}
			</>
		);
	};

	const defaults = {
		...item,
		type: type + "/" + subtype,
	};

	const {
		hasChanges,
		resetForm,
		setIsSubmitting,
		submitForm,
		renderForm,
	} = Form.useForm({
		sections,
		onSubmit,
		defaults,
	});

	const Hero = () => {
		const { width, sizes, height, alt, type, url, mime } = item;
		const srcSet = getSrcSet(sizes);
		const heightPercentage = (height / width) * 100;

		// Temp - Handle non-image heroes.
		if (
			"image" !== type &&
			"audio" !== type &&
			"video" !== type &&
			!item.thumbnail
		) {
			return null;
		}

		const style = {
			position: "relative",
			boxSizing: "border-box",
			paddingTop: heightPercentage ? heightPercentage + "%" : "50%",
			background: "var(--fluid-primary-background)",
		};

		let mediaContent = "";

		if ("audio" == type || "video" == type) {
			mediaContent = (
				<video width="100%" controls>
					<source src={url} type={mime} />
				</video>
			);
		} else {
			mediaContent = (
				<img
					src={item.thumbnail}
					srcSet={srcSet}
					height={height}
					width={width}
					alt={alt}
					loading="lazy"
				/>
			);
		}

		return (
			<div style={style}>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
					}}
				>
					{mediaContent}
				</div>
			</div>
		);
	};

	return (
		<Page
			title={__("Attachment")}
			hero={<Hero />}
			footer={(hasChanges || responseMessage.message) && <Footer />}
		>
			<Layout.Headline>{title}</Layout.Headline>
			{renderForm()}
		</Page>
	);
};
