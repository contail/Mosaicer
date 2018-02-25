# Copyright 2017 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import os
import numpy as np
import tensorflow as tf
import time


def load_graph(model_file):
    graph = tf.Graph()
    graph_def = tf.GraphDef()

    with open(model_file, "rb") as f:
        graph_def.ParseFromString(f.read())
    with graph.as_default():
        tf.import_graph_def(graph_def)

    return graph


def read_tensor_from_image(
        input_height=299,
        input_width=299,
        input_mean=0,
        input_std=255):
    input_name = "file_reader"
    output_name = "normalized"
    # file_reader = tf.read_file(file_name, input_name)
    # image_reader = tf.image.decode_jpeg(image_tensor, channels=3, name="jpeg_reader")
    image_tensor = tf.placeholder(dtype=np.uint8, shape=[299, 299, 3], name="image_tensor")
    float_caster = tf.cast(image_tensor, tf.float32)
    dims_expander = tf.expand_dims(float_caster, 0)
    resized = tf.image.resize_bilinear(dims_expander, [input_height, input_width])
    normalized = tf.divide(tf.subtract(resized, [input_mean]), [input_std])

    return normalized, image_tensor


def load_labels(label_file):
    label = []
    proto_as_ascii_lines = tf.gfile.GFile(label_file).readlines()
    for l in proto_as_ascii_lines:
        label.append(l.rstrip())
    return label


def run(faces, model_dir, args=None):
    result = {}
    input_height = 299
    input_width = 299
    input_mean = 0
    input_std = 255
    model_file = os.path.join(model_dir, 'output_graph.pb')
    label_file = os.path.join(model_dir, 'output_labels.txt')

    if args:
        if args.graph:
            model_file = args.graph
        if args.image:
            image_name = args.image
        if args.labels:
            label_file = args.labels
            # input size
        if args.input_height:
            input_height = args.input_height
        if args.input_width:
            input_width = args.input_width
        if args.input_mean:
            input_mean = args.input_mean
        if args.input_std:
            input_std = args.input_std
    graph = load_graph(model_file)

    input_name = "import/Mul"
    output_name = "import/final_result"
    input_operation = graph.get_operation_by_name(input_name)
    output_operation = graph.get_operation_by_name(output_name)
    results = []
    precisions = []

    with graph.as_default() as g:
        with tf.Session(graph=g) as sess:
            for face in faces:
                    image_op, image_tensor = read_tensor_from_image(
                        input_height=input_height,
                        input_width=input_width,
                        input_mean=input_mean,
                        input_std=input_std)
                    t = sess.run(image_op, feed_dict={image_tensor: face})
                    results.append(sess.run(output_operation.outputs[0], {
                        input_operation.outputs[0]: t
                    }))

    for result in results:
        result = np.squeeze(result)
        top_k = result.argsort()[-5:][::-1]
        labels = load_labels(label_file)
        precision = {}
        for i in top_k:
            precision.update({labels[i]: result[i]})  # desc
        precisions.append(precision)
    return precisions


if __name__ == "__main__":
    file_name = "tensorflow/examples/label_image/data/grace_hopper.jpg"
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", help="image to be processed")
    parser.add_argument("--graph", help="graph/model to be executed")
    parser.add_argument("--labels", help="name of file containing labels")
    parser.add_argument("--input_height", type=int, help="input height")
    parser.add_argument("--input_width", type=int, help="input width")
    parser.add_argument("--input_mean", type=int, help="input mean")
    parser.add_argument("--input_std", type=int, help="input std")
    args = parser.parse_args()

    #run(file_name, "temp", args)
