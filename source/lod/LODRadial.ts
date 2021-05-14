import {LODControl} from './LODControl';
import {Vector3} from 'three';

const pov = new Vector3();
const position = new Vector3();

/**
 * Check the planar distance between the nodes center and the view position.
 *
 * Distance is adjusted with the node level, more consistent results since every node is considered.
 */
export class LODRadial implements LODControl 
{
	/**
	 * Minimum ditance to subdivide nodes.
	 */
	public subdivideDistance: number = 50;

	/**
	 * Minimum ditance to simplify far away nodes that are subdivided.
	 */
	public simplifyDistance: number = 300;

	updateLOD(view, camera, renderer, scene) 
	{
		const self = this;

		camera.getWorldPosition(pov);

		view.children[0].traverse(function(node) 
		{
			node.getWorldPosition(position);

			let distance = pov.distanceTo(position);
			distance /= Math.pow(2, view.provider.maxZoom - node.level);

			if (distance < self.subdivideDistance) 
			{
				node.subdivide();
			}
			else if (distance > self.simplifyDistance && node.parentNode) 
			{
				node.parentNode.simplify();
			}
		});
	}
}