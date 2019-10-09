<h2><?php _e( 'Assistant', 'fl-assistant' ); ?></h2>
<table class="form-table" role="presentation">
	<tbody>
	<tr class="user-fl-asst-hidden-ui-wrap">
		<th>
			<label for="fl_asst_hidden_ui"><?php _e( 'Toggle Button', 'fl-assistant' ); ?></label>
		</th>
		<td>
			<select name="fl_asst_hidden_ui" id="fl_asst_hidden_ui">
				<?php
				foreach ( $hidden_appearances as $value => $label ) {
					$selected = $hidden_appearance === $value ? 'selected' : '';
					?>
					<option value="<?php echo $value; ?>" <?php echo $selected; ?> ><?php echo $label; ?></option>
					<?php
				}
				?>
			</select>
		</td>
	</tr>
	<tr class="user-show-assistant-in-admin-wrap">
		<th scope="row"><?php _e( 'Show in Admin', 'fl-assistant' ); ?></th>
		<td>
			<label for="show_assistant_in_admin">
				<input type="checkbox" id="show_assistant_in_admin" name="show_assistant_in_admin" <?php echo $show_in_admin ? 'checked' : null; ?> >
				<?php _e( 'Show Assistant UI in the WordPress Admin', 'fl-assistant' ); ?>
			</label>
		</td>
	</tr>
	</tbody>
</table>
